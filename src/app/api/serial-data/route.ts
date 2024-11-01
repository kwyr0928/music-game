import { NextResponse } from "next/server";
import { SerialPort } from "serialport";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const port = new SerialPort({ path: "COM15", baudRate: 1200 });

let serialData = "";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
port.on("data", (data: Buffer) => {
  serialData = data.toString();
});

export function GET() {
  return NextResponse.json({ data: serialData });
}
