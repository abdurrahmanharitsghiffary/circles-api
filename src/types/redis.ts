interface NX {
  NX?: true;
}
interface XX {
  XX?: true;
}
interface LT {
  LT?: true;
}
interface GT {
  GT?: true;
}
interface CH {
  CH?: true;
}
interface INCR {
  INCR?: true;
}
export type ZAddOptions = (NX | (XX & LT & GT)) & CH & INCR;

export type RedisCommandArgument = string | Buffer;

export type ZMember = {
  score: number;
  value: RedisCommandArgument;
};
