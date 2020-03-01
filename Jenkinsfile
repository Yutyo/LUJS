pipeline {
  agent any

  tools {nodejs "node"}

  stages {
    stage('Download Dependencies') {
      steps {
        sh 'npm install'
      }
    }
  }
}