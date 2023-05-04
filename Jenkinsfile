pipeline {
  agent any
  stages {
    stage('Clonar repositorio') {
      steps {
          git branch: 'Develop', url: 'https://github.com/JorchCanelo/Proyecto-DevOps-2023.git'
        }
      }
    
    stage('Instalar dependencias') {
      steps {
        powershell 'npm install'
      }
    }
    stage('Ejecutar pruebas') {
      steps {
        powershell 'npm test -- --forceExit' 
      }
    }
    stage('Ejecutar pipeline de construcción y despliegue') {
      steps {
        build 'Proyecto-Final-Devops-Despliegue'
      }
    }
  }
}

pipeline {
agent any
  stages {
    stage('Construir y desplegar') {
        steps {
        powershell "docker build -f Dockerfile -t sicei-${env.BRANCH_NAME}:1.0.0-${env.BUILD_NUMBER} ."
        powershell "docker run -p 3000:8080 sicei-${env.BRANCH_NAME}:1.0.0-${env.BUILD_NUMBER}"
      }
    }
  }
}
