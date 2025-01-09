from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizResult


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'answers']
    
    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        question = Question.objects.create(**validated_data)

        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)
        return question



class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    image_url = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'description',
            'owner_username',
            'image_url',
            'questions',
            'completed'
        ]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def get_completed(self, object):
        user = self.context['request'].user
        if user.is_authenticated:
            return QuizResult.objects.filter(user=user, quiz=object).exists()
        return False
        
    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        owner = self.context['request'].user
        quiz = Quiz.objects.create(owner = owner, **validated_data)

        for question_data in questions_data:
            answers_data = question_data.pop('answers', [])
            question = Question.objects.create(quiz=quiz, **question_data)

            for answer_data in answers_data:
                Answer.objects.create(question=question, **answer_data)

        return quiz