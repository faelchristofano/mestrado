from django.urls import path
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld),
    #path('', views.index, name='index'),
    path('', views.projeto, name='projeto'),
    path('transferDataToServer/', views.transferDataToServer, name='transferDataToServer')
]
