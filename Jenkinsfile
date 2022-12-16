pipeline {

    agent any
    parameters {
        string(name: 'ENV_TAG', defaultValue: 'dev')
    }

    environment {
//            npm_config_cache = 'npm-cache'
           APP_NAME = "vue-partner-portal-reimagined"
           IMAGE_BASE_NAME = "${CI_REGISTRY}/${APP_NAME}"
//            HOME="."
//            DOCKERHUB_CREDENTIALS=credentials('docker-credentials')
    }

    stages {
//         stage('Test') {
//             agent { docker {
//                 image 'cypress/browsers:node12.4.0-chrome76'
//                 args '--ipc=host -v /dev/shm:/dev/shm'
//                 } }
//             steps {
//                 cache(maxCacheSize: 900, defaultBranch: 'staging', caches: [
//                 arbitraryFileCache(path: '.cache/Cypress/',compressionMethod: 'NONE')
//                 ]) {
//                     sh '''
//                         npm ci
//                         npm run test
//                     '''
//                 }
//
//             }
//         }

        stage('Docker Build & Push Image') {
            steps {
                 script {
                    if(env.BRANCH_NAME == "main") {
                        env.ENV_TAG = "prod"
                        env.BFF_URL = "https://partner-bff.sendyit.com/api/v1/"
                        env.MAPS_KEY='AIzaSyAhkxyTtJznhU-kZ9wc1u6AXxChFu44Zww'
                    } else {
                        env.ENV_TAG = "dev"
                        env.BFF_URL = "https://partner-bff-test.sendyit.com/api/v1/"
                        env.MAPS_KEY ='AIzaSyBWMVg9uhO7-BieEMUB3cVzm9O78RGtugo'
                    }

                    sh '''
                        IMAGE_TAG="${ENV_TAG}_$(date +%Y-%m-%d-%H-%M)"
                        IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                        docker build --build-arg VUE_APP_PORTAL='sendy:partner' --build-arg VUE_APP_PARTNER_BFF=${env.BFF_URL}  --build-arg MAPS_API_KEY=${env.MAPS_KEY}  --build-arg MIX_PANEL_TOKEN='ce3d573d8a523759617f9d21792b1a4f' -f Dockerfile -t $IMAGE_NAME .
                        docker push $IMAGE_NAME
                    '''
            }
        }
    }
}
