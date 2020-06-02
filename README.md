# react-native-apply-version

 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This tool allows you to easily apply the version of a React Native application specified in package.json to the android and ios app source.
It will update the following files if found:

- **./android/app/src/main/AndroidManifest.xml**
- **./android/app/build.gradle**
- **./ios/<app_name>/Info.plist**

## Version number format

In order to use this package, your project version must comply with the format: {versionName}+{versionCode},
versionName should be in format as described on [semver.org](https://semver.org/).

## Setup and Usage

There are two ways to install react-native-apply-version: globally and locally.

### Local Installation

This is the recommended way to install react-native-apply-version.

npm:

```bash
npm install react-native-apply-version --save-dev
```

You can then use this command in your project directory to run react-native-apply-version:

npm:

```bash
$ npm run apply-version
```

### Global Installation

This installation method allows you to use react-native-apply-version in any project.

npm:

```bash
npm install -g react-native-apply-version
```

You can then use this command in your project directory to run react-native-apply-version:

```bash
apply-version
```

## Behaviour

When invoked, react-native-apply-version will read the version specified in package.json and make the following changes to your project files:

### Update Android Project Version

It will update the **version name** and the **version code** in both `build.gradle` and `AndroidManifest.xml`.

#### About AndroidManifest.xml

Version information should not be in the `AndroidManifest.xml` since this information is overridden by `build.gradle`.

See https://developer.android.com/studio/publish/versioning for further informations.

For that reason `react-native-apply-version` will only write in the `AndroidManifest.xml` if `android:versionCode` and/or `android:versionName` are already in the file.

### Update iOS Project Version

It will update the **CFBundleShortVersionString** and the **CFBundleVersion** in `Info.plist`,
using the versionName and versionCode respectively,
these will be extracted from the versin field in your package.json, using the format specified above.

## License

This software uses the [MIT license](LICENSE.txt).

## Contributing

You must use the following style guide:

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

This project contains a linting config, you should setup `eslint` into your IDE with `.eslintrc.js`.
