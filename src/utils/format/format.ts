
function formatToUKString(date: string) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-UK', options);
}

function formatType(type: string): string {
    return type.split("-").join(" ");
}

export { formatToUKString, formatType };
