pipeline {
  agent any

  tools {nodejs "NodeJS"}

  stages {
    stage('Download Dependencies') {
      steps {
        sh 'npm install'
      }
    }
  }
}