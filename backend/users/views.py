from .models import User
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404


class SignupView(APIView):
    serializer_class = SignupSerializer
    permission_classes = (AllowAny,)
    authentication_classes = (JWTAuthentication, )

    def post(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"id":user.id})
        
        return Response({
                "error": True,
                "message" : serializer.errors })
        

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    authentication_classes = (JWTAuthentication,)


class LogoutView(APIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        try:
            refresh_token = self.request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            data = {
                'success': True,
                'message': "You are loggout out"
            }
            return Response(data, status=205)
        except TokenError:
            return Response(status=400)


class VerifyEmail(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        user_id = request.data.get('id', None)
        code = request.data.get('code', None)

        if not code or not user_id:
            return Response({"success": False}, status=400)
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"success": False}, status=400)
        
        is_valid, message = self.check(user, code)
        if not is_valid:
            return Response({"success": message}, status=400)
        tokens = self.get_tokens_for_user(user)
        tokens.update({"success": True})
        return Response(tokens)

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    @staticmethod
    def check(user, code):
        codes = user.verify.filter(code=code, 
                                   expiration_time__gte=timezone.now(),
                                   is_confirmed=False)

        if not codes.exists():
            return False, False

        user.verified = True
        user.save()

        matched_code = codes.first()
        matched_code.is_confirmed = True
        matched_code.save()

        return True, True


class UpdateProfileView(APIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = (IsAuthenticated, )
    def get(self, request, *args, **kwargs):
        pass
    def post(self, request, *args, **kwargs):
        pass


class UserView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request, *args, **kwargs):
        username = kwargs.get("username", None)
        user = get_object_or_404(User, username=username)
        
        if request.user.username == user.username:
            context = {
                'username':user.username,
                'profile_image':user.photo.url,
                "email": user.email,
                "birhday": user.date_of_birth,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "bio": user.bio

            }
        else:
            context = {
                "username": user.username,
                'profile_image':user.photo.url,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "bio": user.bio
            }
        return Response(context)
    

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request, *args, **kwargs):
        user = request.user
        context = {
            'first_name':user.first_name,
            'last_name':user.last_name,
            'username':user.username,
            'profile_image':user.photo.url,
            'bio':user.bio,
        }
        return Response(context)