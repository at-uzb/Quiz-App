from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Quiz, Question, Answer
from .serializers import QuizSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class QuizListView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = (AllowAny, )


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.prefetch_related('questions__answers')
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = (JWTAuthentication, )
    
    def get_serializer_context(self):
        return {'request': self.request}



class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = (JWTAuthentication, )


class QuizSubmitView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (JWTAuthentication, )

    def post(self, request, quiz_id):
        user_answers = request.data.get('answers', {})
        quiz = Quiz.objects.prefetch_related('questions__answers').get(id=quiz_id)
        score = 0
        total_questions = quiz.questions.count()

        for question in quiz.questions.all():
            selected_answer = question.answers.filter(
                id = user_answers[str(question.id)]
            ).first()
            if selected_answer and selected_answer.is_correct:
                score += 1

        return Response(
            {
                'score': score, 
                'total_questions': total_questions
            }, 
            status=status.HTTP_200_OK
            )
