from django.shortcuts import render, redirect
from .forms import UserForm

# Create your views here.


def statki(request):
    return render(request, 'statki/statki.html', {})

def register(request):

    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.set_password(user.password)    #hashwanie hasła
            user.save()
            return redirect('statki')
    else:
        form = UserForm

    return render(request, 'statki/register.html', {'form': form})





