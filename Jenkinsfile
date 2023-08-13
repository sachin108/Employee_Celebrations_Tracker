pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "credentials('dockerHub').username"
        DOCKER_HUB_PASSWORD = "credentials('dockerHub').password"
    }

    stages {
        stage('Pull from Docker Hub') {
            steps {
                sh 'docker pull 108sachin/myapp:latest'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker run -p 9999:8000 108sachin/myapp:latest'
            }
        }
    }
}
