#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import plist from 'plist';
import { isVersionFormatCorrect } from './versionUtils';

const display = console.log; // eslint-disable-line no-console

const paths = {
  androidManifest: './android/app/src/main/AndroidManifest.xml',
  buildGradle: './android/app/build.gradle',
  infoPlist: './ios/<APP_NAME>/Info.plist',
  packageJson: './package.json',
};

function getPackageJson() {
  let packageJSON = null;
  try {
    packageJSON = JSON.parse(fs.readFileSync(paths.packageJson));
  } catch (err) {
    display(chalk.red(`${chalk.bold.underline('ERROR:')} Cannot find file with name ${path.resolve(paths.packageJson)}`));
    process.exit(1);
  }

  return packageJSON;
}

async function setIosApplicationVersion(versionName, versionCode) {
   display('');
   display(chalk.yellow('IOS version info:'));
   display(versionName);
   display('');
   display(chalk.yellow(`Will set CFBundleShortVersionString to ${chalk.bold.underline(versionName)}`));
   display(chalk.yellow(`Will set CFBundleVersion to ${chalk.bold.underline(versionCode)}`));
   try {
     const plistInfo = plist.parse(fs.readFileSync(paths.infoPlist, 'utf8'));
     plistInfo.CFBundleShortVersionString = versionName;
     plistInfo.CFBundleVersion = versionCode;
     fs.writeFileSync(paths.infoPlist, plist.build(plistInfo), 'utf8');
     display(chalk.green(`Version replaced in ${chalk.bold('Info.plist')}`));
   } catch (err) {
     display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find file with name ${path.resolve(paths.infoPlist)}. This file will be skipped`));
   }
}

async function setAndroidApplicationVersion(versionName, versionCode) {
  display('');
  display(chalk.yellow('Android version info:'));
  display(versionName);
  display('');
  display(chalk.yellow(`Will set Android version to ${chalk.bold.underline(versionName)}`));
  display(chalk.yellow(`Will set Android version code to ${chalk.bold.underline(versionCode)}`));
  try {
    const buildGradle = fs.readFileSync(paths.buildGradle, 'utf8');
    const newBuildGradle = buildGradle.replace(/versionCode \d+/g, `versionCode ${versionCode}`)
      .replace(/versionName "[^"]*"/g, `versionName "${versionName}"`);
    fs.writeFileSync(paths.buildGradle, newBuildGradle, 'utf8');
    display(chalk.green(`Version replaced in ${chalk.bold('build.gradle')}`));
  } catch (err) {
    display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find file with name ${path.resolve(paths.buildGradle)}. This file will be skipped`));
  }
  try {
    const androidManifest = fs.readFileSync(paths.androidManifest, 'utf8');
    if (androidManifest.includes('android:versionCode') || androidManifest.includes('android:versionName')) {
      const newAndroidManifest = androidManifest.replace(/android:versionCode="\d*"/g, `android:versionCode="${versionCode}"`)
        .replace(/android:versionName="[^"]*"/g, `android:versionName="${versionName}"`);
      fs.writeFileSync(paths.androidManifest, newAndroidManifest, 'utf8');
      display(chalk.green(`Version replaced in ${chalk.bold('AndroidManifest.xml')}`));
    }
  } catch (err) {
    display(chalk.yellowBright(`${chalk.bold.underline('WARNING:')} Cannot find file with name ${path.resolve(paths.androidManifest)}. This file will be skipped`));
  }
}

const changeVersion = async () => {
  const packageJSON = getPackageJson();
  display(chalk.yellow(`Version currently set on package.json is ${chalk.bold.underline(packageJSON.version)}`));
  if (isVersionFormatCorrect(packageJSON.version)) {
    display(chalk.red(`${chalk.bold.underline('ERROR:')} version field in package.json must be present and in the format: major.minor.patch+versionCode`));
    process.exit(1);
  }
  const [ versionName, versionCode ] = packageJSON.version.split('+');
  paths.infoPlist = paths.infoPlist.replace('<APP_NAME>', packageJSON.name);
  await setAndroidApplicationVersion(versionName, versionCode);
  await setIosApplicationVersion(versionName, versionCode);
  display('');
};

changeVersion();
