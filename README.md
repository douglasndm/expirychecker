# Controle de validade

Passos necessários para realizar uma build bem sucedida do app. Atenção que o aplicativo só foi desenvolvido para o Android.

```
npm insall
# OU
yarn
```

1. ## Configurando o firebase no projeto
Primeiro de tudo você precisa criar uma nova aplicatição no [Firebase Console](https://console.firebase.google.com/?hl=pt-br). Após criado o aplicativo você deve ir na página de configurações do projeto dentro do Firebase Console e baixar o arquivo google-services.json e coloca-lo dentro da pasta **/android/app/**

2. ## Configurando o Admob
Crie um novo aplicativo no [Google Admob](https://admob.google.com/home/) e crie as unidades de anúncios necessárias. Depois crie um arquivo na raiz do projeto chamado **firebase.json** conforme examplo em **firebase.json.example** e coloque a ID do aplicativo do Google Admob.


3. ## Configurando arquivo .keystore para builds de produção
É necessário gerar o arquivo .keystore da aplicação conforme [documentação do React Native](https://reactnative.dev/docs/signed-apk-android), nomeando como **controledevalidade.keystore** e colocando-lo na pasta **/android/app**

4. ## Configurando variavéis de ambiente e guardando suas chaves privadas privadamente
Na raiz no projeto crie um arquivo **.env** conforme exemplo no arquivo **.env.example** e adicione suas chaves geradas nos passos anteriores.
```
ANDROID_UPLOAD_STORE_PASSWORD <- Store password do arquivo keystore criado no passo 4
ANDROID_UPLOAD_KEY_PASSWORD <- Key password do arquivo keystore criado no passo 4

ANDROID_ADMOB_ADUNITID_ADDPRODUCT= <- Código de unidade de anúncido do admob Interstitial
ANDROID_ADMOB_ADUNITID_ADDLOTE= <- Código de unidade de anúncido do admob Interstitial
ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS= <- Código de unidade de anúncido do admob Banner
ANDROID_ADMOB_ADUNITID_BETWEENSTOREGROUPS= <- Código de unidade de anúncido do admob Banner
ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDAPRODUCT= <- Código de unidade de anúncido do admob Banner
ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERADDABATCH= <- Código de unidade de anúncido do admob Banner
ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEAPRODUCT= <- Código de unidade de anúncido do admob Banner
ANDROID_ADMOB_ADUNITID_SUCCESSSCREENAFTERDELETEABATCH= <- Código de unidade de anúncido do admob Banner

APPLICATION_SECRET_BACKUP_CRYPT= <- UMA CHAVE ÚNICA DA SUA APLICAÇÃO USADA PARA CRIPTOGRAFAR E DESCRIPTOGRAFAR OS BACKUPS GERADO PELO APLICATIVO (ATENÇÃO SE VOCÊ MUDAR ESSE VALOR NO FUTURO SEUS BACKUPS ANTERIORES SERÃO INVALIDADOS)

GOOGLE_SIGNIN_CLIENT_ID= <- Client ID encontrado nas configurações do firebase console

REVENUECAT_PUBLIC_APP_ID= <- ID do aplicativo na Revenuecat
```

## Depois disso é só partir para o abraço e compilar
```
npx react-native run-android || yarn android
```
