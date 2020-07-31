pipeline {
  agent any

  tools {nodejs "NodeJS"}

  stages {
    stage('Download Dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Format and Lint Code') {
      steps {
        sh 'npm run format'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}