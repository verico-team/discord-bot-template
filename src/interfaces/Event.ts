export interface Event {
    event: any;
    once: boolean;
    execute(...args: any): any;
}