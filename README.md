wirvsvirus-backend

# Setup
Run 
```bash
yarn install
```
to install the dependencies.

## Firebase service account
You need to create a [firebase service account](https://firebase.google.com/docs/admin/setup) to enable firebase auth. You get a `.json`-file, which you have to save on your machine locally. Then set the `GOOGLE_APPLICATION_CREDENTIALS` variable in the `.env`-file to the file location of the `.json` file.