export default class SiteLogger {
    displayLog(message) {
        document.getElementById('hash-comparison').innerHTML += message + '\n';
    }
}