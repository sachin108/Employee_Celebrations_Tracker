pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/sachin108/Employee_Celebrations_Tracker.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'pip install -r requirements.txt'
      }
    }

    stage('Build') {
      steps {
        sh 'python manage.py collectstatic --noinput'
      }
    }

    stage('Deploy') {
      steps {
        sh 'sudo service nginx stop' 
        sh 'sudo cp dist/your-app.tar.gz /path/to/deployment/directory/' // Copy package to deployment directory
        sh 'cd /path/to/deployment/directory/ && sudo tar -zxvf your-app.tar.gz' // Extract package
        sh 'sudo service nginx start' // Start Nginx or Apache
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    success {
      echo 'Pipeline completed successfully'
    }
    failure {
      echo 'Pipeline failed'
    }
  }
}
