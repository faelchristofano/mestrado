from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt,csrf_protect 
import json
from . import dataread

# Create your views here.

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def helloworld(request):
    return HttpResponse('Hello World!')

def projeto(request):
    return render(request, 'projeto/index.html')

@csrf_exempt #This skips csrf validation. Use csrf_protect to have validation
def transferDataToServer(request):
    if request.method == 'POST':
        dataread.loadData(request.POST['data'])
        #dataread.loadData(data_raw)