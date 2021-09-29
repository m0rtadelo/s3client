class Counter {
  public static counter = 0;
  public static get() {
    if (Counter.counter > 998) {
      Counter.counter = 0;
    }
    Counter.counter++;
    return Counter.counter;
  }
}
const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
export const getId = () => (s4() + s4() + s4() + '-' + (new Date().getTime()) + '.' + Counter.get() );
