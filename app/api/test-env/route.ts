import { NextResponse } from 'next/server';

export async function GET() {
    const varsToCheck = [
        'AUTH_GOOGLE_ID',
        'AUTH_GOOGLE_SECRET',
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
        'DATABASE_URL',
    ];

    const results = varsToCheck.map(key => {
        const value = process.env[key];
        return {
            variable: key,
            isSet: !!value,
            length: value ? value.length : 0,
            // Show first 4 chars for verification, masking the rest
            preview: value ? `${value.substring(0, 4)}...` : 'NOT SET'
        };
    });

    console.log('\n--- Environment Variable Check ---');
    results.forEach(res => {
        console.log(`${res.variable}: ${res.isSet ? 'OK ✅' : 'MISSING ❌'} (${res.preview})`);
    });
    console.log('----------------------------------\n');

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        checks: results
    });
}
