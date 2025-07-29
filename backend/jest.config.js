module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/server.ts',
    ],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
    },
};
