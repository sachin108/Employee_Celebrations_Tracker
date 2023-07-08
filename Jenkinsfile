pipeline {
    agent any

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
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker build -t my-django-app .'
                sh 'docker run -p 9999:8000 my-django-app'
            }
        }
    }
}
