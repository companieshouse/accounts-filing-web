
export class FormatProfileType {
    static formatType(type: string): string {
        return type.split("-").join(" ");
    }
}
