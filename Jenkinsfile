pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USERNAME = "credentials('dockerHub').username"
        DOCKER_HUB_PASSWORD = "credentials('dockerHub').password"
    }
    
    stages {
        stage('Checkout') {
            steps {
              git branch: 'main', url: 'https://github.com/sachin108/Employee_Celebrations_Tracker.git'
            }
        }

        stage('Build') {
            steps {
                sh 'pip install -r requirements.txt'
                sh 'python3 manage.py collectstatic --noinput'
                sh 'python3 manage.py makemigrations'
                sh 'python3 manage.py migrate'
                sh 'docker build -t my-django-app .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerHub', url: '') {
                        sh 'docker tag my-django-app 108sachin/my-django-app:latest'
                        sh 'docker push 108sachin/my-django-app:latest'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker run -p 9999:8000 my-django-app'
            }
        }
    }
}
