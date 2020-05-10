         /$$$$$$$$ /$$   /$$ /$$      /$$ /$$$$$$$$ /$$$$$$$  /$$$$$$  /$$$$$$
        |__  $$__/| $$  | $$| $$$    /$$$| $$_____/| $$__  $$|_  $$_/ /$$__  $$
            | $$   | $$  | $$| $$$$  /$$$$| $$      | $$  \ $$  | $$  | $$  \__/
            | $$   | $$  | $$| $$ $$/$$ $$| $$$$$   | $$$$$$$/  | $$  | $$
            | $$   | $$  | $$| $$  $$$| $$| $$__/   | $$__  $$  | $$  | $$
            | $$   | $$  | $$| $$\  $ | $$| $$      | $$  \ $$  | $$  | $$    $$
            | $$   |  $$$$$$/| $$ \/  | $$| $$$$$$$$| $$  | $$ /$$$$$$|  $$$$$$/
            |__/    \______/ |__/     |__/|________/|__/  |__/|______/ \______/

# TUMERIC [![Generic badge](https://img.shields.io/badge/Made%20with-React-blue)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/Made%20with-Flask-red)](https://shields.io/)

### Authors

-   **Probhonjon Baruah** - [bigfoot31](https://github.com/bigfoot31)

### Repo structure

-   client: frontend code written with React
-   server: backend code written with Flask
-   data_preprocess: data processing code
    -   scripts: files to generate images and json files
-   nginx: nginx web server to host frontend production code

### Deployment

#### deployment is done through docker

-   nginx image: docker image that hosts frontend code
-   python image: docker image that host backend code

#### requirements

-   certs: valid https certs
-   data: files that contain expression and fold-change data
-   static: folder that contains all images including homepage help-image

#### process

```bash
git clone https://github.com/bigfoot31/tumeric
cp -r certs tumeric
cp -r data tumeric
cp -r static tumeric
cd tumeric
docker-compose build
docker-compose up -d
```

#### additional info

-   download fonts from https://google-webfonts-helper.herokuapp.com/fonts/noto-sans-sc?subsets=latin
-   virus scan
    ```bash
    sudo freshclam
    sudo clamscan --infected -r /
    ```
-   if clamscan not installed
    ```bash
    sudo yum install -y epel-release
    sudo yum install -y clamav
    ```
