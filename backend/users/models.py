import uuid
import random
from django.db import models
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .achievements import award_achievements

class BaseModel(models.Model):
    id = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, primary_key=True)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser, BaseModel):
    email = models.EmailField(unique=True)
    verified = models.BooleanField(default=False)
    date_of_birth = models.DateField(null=True, blank=True)
    photo = models.ImageField(
        upload_to='profile-images/',
        default="images/default_user.png"
        )
    bio = models.CharField(max_length=350, default="")
    quizzes_completed = models.PositiveIntegerField(default=0)
    achievements = models.TextField(blank=True)
    average_quiz_percentage = models.FloatField(default=0.0)

    def __str__(self):
        return self.username
    
    def create_verify_code(self):
        code = "".join([str(random.randint(0, 10000) % 10) for _ in range(5)])
        EmailConfirmation.objects.create(
            user_id=self.id,
            code=code
        )
        return code
    
    def update_quiz_stats(self, score):
        total_quizzes = self.quizzes_completed
        self.average_quiz_percentage = (
            (self.average_quiz_percentage * total_quizzes) + score
        ) / (total_quizzes + 1)
        self.quizzes_completed += 1
        self.save()

        award_achievements(self, score)


class EmailConfirmation(BaseModel):
    code = models.CharField(max_length=4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verify')
    expiration_time = models.DateTimeField(null=True)
    is_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user.__str__())
    
    def save(self, *args, **kwargs):
        self.expiration_time = timezone.now() + timedelta(minutes=5)
        super(EmailConfirmation, self).save(*args, **kwargs)