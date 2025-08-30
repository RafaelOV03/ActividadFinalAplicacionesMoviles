all:
	npm install
	npm run tauri android init
	npm run tauri android build
	adb install src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk