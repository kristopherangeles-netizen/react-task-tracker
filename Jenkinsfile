pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install and test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Generate coverage') {
            steps {
                sh 'npm run test:coverage'
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: 'Coverage Report'
                ])
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/lcov.info', allowEmptyArchive: true
                }
            }
        }

        stage('Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube analysis') {
            when {
                branch 'main'
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Quality gate') {
            when {
                branch 'main'
            }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Archive artifact') {
            when {
                branch 'main'
            }
            steps {
                sh 'tar -czf "release-${BUILD_NUMBER}.tar.gz" dist Dockerfile'
                archiveArtifacts artifacts: 'release-*.tar.gz', fingerprint: true
            }
        }
    }
}
