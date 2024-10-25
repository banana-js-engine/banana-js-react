import { ScriptComponent } from '@mfkucuk/banana-js';

export class HelloWorldScript extends ScriptComponent {

    ready() {
        console.log('Hello, world!');
    }
}