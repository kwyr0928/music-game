// src/app/api/serial-data/route.ts
import { NextResponse } from "next/server";
import { ReadlineParser, SerialPort } from "serialport";

// シリアルポートの状態を保持
let port: SerialPort | null = null;
let parser: ReadlineParser | null = null;

// シリアルポートを初期化する関数
async function initializeSerialPort() {
  if (!port) {
    try {
      port = new SerialPort({
        path: "COM15",
        baudRate: 1200,
      });

      parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

      // エラーハンドリング
      port.on('error', (err) => {
        console.error('Serial Port Error:', err);
        port = null;
      });

      // ポートが閉じた時の処理
      port.on('close', () => {
        console.log('Serial port closed');
        port = null;
      });
    } catch (error) {
      console.error("Failed to initialize serial port:", error);
      throw error;
    }
  }
  return port;
}

export async function GET() {
  try {
    // シリアルポートが初期化されていない場合は初期化
    if (!port) {
      await initializeSerialPort();
    }

    if (!port || !parser) {
      return NextResponse.json(
        { error: "Serial port not initialized" },
        { status: 500 }
      );
    }

    // データを読み取る Promise を作成
    const readData = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Reading timeout'));
      }, 5000);

      parser!.once('data', (data) => {
        clearTimeout(timeout);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        resolve(data.toString());
      });

      port!.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    // データを待機
    const data = await readData;
    return NextResponse.json({ data });

  } catch (error) {
    console.error("Error reading from serial port:", error);
    return NextResponse.json(
      { error: "Failed to read from serial port" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = body;

    if (!port) {
      await initializeSerialPort();
    }

    if (!port) {
      return NextResponse.json(
        { error: "Serial port not initialized" },
        { status: 500 }
      );
    }

    await new Promise((resolve, reject) => {
      port!.write(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error writing to serial port:", error);
    return NextResponse.json(
      { error: "Failed to write to serial port" },
      { status: 500 }
    );
  }
}