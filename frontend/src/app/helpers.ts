export function arrayBufferToBase64(buffer : any) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export function unixTimeStampStringToDate(unixTime: string): Date {
    return new Date(Math.round(parseFloat(unixTime) * 1000))
}