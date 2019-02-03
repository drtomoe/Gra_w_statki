from django import forms
from django.contrib.auth.models import User
from django.core import validators

class UserForm (forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']