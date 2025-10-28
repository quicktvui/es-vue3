/**
 *
 */
export default function () {
  function onESCreate(params) {

  }

  function onESRestart() {

  }

  function onESStart() {

  }

  function onESResume() {
    console.log('-------MIXINS----onESResume----------')
  }

  function onESPause() {
    console.log('-------MIXINS----onESPause----------')
  }

  function onESStop() {

  }

  function onESDestroy() {

  }

  function onESNewIntent(intent) {

  }

  function onKeyDown(keyEvent) {

  }

  function onKeyUp(keyEvent) {

  }

  function onBackPressed() {
  }

  function onESSaveInstanceState(savedInstanceState) {

  }

  function onESRestoreInstanceState(savedInstanceState) {

  }

  return {
    onESCreate,
    onESRestart,
    onESStart,
    onESResume,
    onESPause,
    onESStop,
    onESDestroy,
    onESNewIntent,
    onKeyDown,
    onKeyUp,
    onBackPressed,
    onESSaveInstanceState,
    onESRestoreInstanceState,
  }
}
