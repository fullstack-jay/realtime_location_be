import responses from "../responses";

export const account = {
    // buat akun baru
    "/accounts/create": {
        post: {
            tags: ["Account"],
            summary: "Buat akun baru",
            description: "Buat akun baru agar bisa mengakses aplikasi",
            operationId: "createAccount",
            parameters: [
                {
                    name: "body",
                    in: "body",
                    description: "Buat akun baru",
                    required: true,
                    schema: {
                        $ref: "#/definitions/create",
                    },
                },
            ],
            responses,
        },
    },

    //Login to account
  "/accounts/login": {
    post: {
      tags: ["Account"],
      summary: "Login account",
      description: "Login into already existing account",
      operationId: "loginAccount",
      parameters: [
        {
          name: "body",
          in: "body",
          description: "Login an account",
          required: true,
          schema: {
            $ref: "#/definitions/login",
          },
        },
      ],
      responses,
    },
  },

    // "/accounts/verify-account": {
    //     post: {
    //         tags: ["Account"],
    //         summary: "Verify account",
    //         description: "Verify created account by using OTP",
    //         operationId: "verifyAccount",
    //         parameters: [
    //             {
    //                 name: "body",
    //                 in: "body",
    //                 description: "Verify an account by entering the OTP and phone number",
    //                 required: true,
    //                 schema: {
    //                     $ref: "#/definitions/verify",
    //                 },
    //             },
    //         ],
    //         responses,
    //     },
    // },

    // Resend OTP
    // "/accounts/resend-otp": {
    //     post: {
    //         tags: ["Account"],
    //         summary: "Resend OTP",
    //         description: "Resending OTP to phone number if not received or expired",
    //         operationId: "resendOTP",
    //         parameters: [
    //             {
    //                 name: "body",
    //                 in: "body",
    //                 description: "Resend OTP to phone number if not received or expired",
    //                 required: true,
    //                 schema: {
    //                     $ref: "#/definitions/resend-otp",
    //                 },
    //             },
    //         ],
    //         responses,
    //     },
    // },
};

export const accountDefinitions = {
    create: {
        type: "object",
        properties: {
            fullName: {
                type: "string",
                required: true,
                default: "Rizqi Reza Ardiansyah",
            },
            phoneNumber: {
                type: "string",
                required: true,
                default: "+62123456789", // Format internasional, sesuaikan dengan format yang diharapkan
            },
            password: {
                type: "string",
                required: true,
                default: "supersecret@123",
            },
        },
    },

    // verify: {
    //     type: "object",
    //     properties: {
    //         phoneNumber: {
    //             type: "string",
    //             required: true,
    //             default: "+62123456789", // Format internasional, sesuaikan dengan format yang diharapkan
    //         },
    //         otp: {
    //             type: "number",
    //             required: true,
    //             default: 1827,
    //         },
    //     },
    // },

    // "resend-otp": {
    //     type: "object",
    //     properties: {
    //         phoneNumber: {
    //             type: "string",
    //             required: true,
    //             default: "+62123456789", // Format internasional, sesuaikan dengan format yang diharapkan
    //         },
    //     },
    // },
};
