export type Nectarfi = {
    "version": "0.1.0",
    "name": "nectarfi",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "deposit",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "depositTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "nectarMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNectarAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdraw",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "withdrawTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "nectarMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNectarAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "nectarAmount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "checkYields",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "clock",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "nectarfiState",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "lastYieldCheck",
                        "type": "i64"
                    },
                    {
                        "name": "currentBestYield",
                        "type": "u64"
                    },
                    {
                        "name": "totalDeposits",
                        "type": "u64"
                    },
                    {
                        "name": "currentBestProtocol",
                        "type": "string"
                    }
                ]
            }
        }
    ],
    "events": [
        {
            "name": "RebalanceEvent",
            "fields": [
                {
                    "name": "timestamp",
                    "type": "i64",
                    "index": false
                },
                {
                    "name": "newProtocol",
                    "type": "string",
                    "index": false
                },
                {
                    "name": "newYield",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "totalBalance",
                    "type": "u64",
                    "index": false
                }
            ]
        }
    ]
};

export const IDL: Nectarfi = {
    "version": "0.1.0",
    "name": "nectarfi",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "deposit",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "depositTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "nectarMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNectarAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdraw",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "withdrawTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "nectarMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNectarAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "nectarAmount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "checkYields",
            "accounts": [
                {
                    "name": "nectarfiState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "clock",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "nectarfiState",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "lastYieldCheck",
                        "type": "i64"
                    },
                    {
                        "name": "currentBestYield",
                        "type": "u64"
                    },
                    {
                        "name": "totalDeposits",
                        "type": "u64"
                    },
                    {
                        "name": "currentBestProtocol",
                        "type": "string"
                    }
                ]
            }
        }
    ],
    "events": [
        {
            "name": "RebalanceEvent",
            "fields": [
                {
                    "name": "timestamp",
                    "type": "i64",
                    "index": false
                },
                {
                    "name": "newProtocol",
                    "type": "string",
                    "index": false
                },
                {
                    "name": "newYield",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "totalBalance",
                    "type": "u64",
                    "index": false
                }
            ]
        }
    ]
};
