// ===============================
// Google Apps Script Web App URL
// ===============================
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby_AnAUgPb2hgoPPR1FlgBDpNpR3tV07Eozt5Tt6gr0oeP3KNwzFfH_lT5sL-n9Sxk_Fw/exec";


// ===============================
// Build Payload
// ===============================
const buildPayload = (type, data) => {

    return {
        registrationType: type,
        ...data
    };

};


// ===============================
// Send Registration
// ===============================
const sendRegistration = async (type, data) => {

    const payload = buildPayload(type, data);

    console.log("Sending Payload:", payload);


    try {


        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(payload)

        });



        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          console.error('Registration API returned non-ok status:', response.status, errorText);
          throw new Error(
            `Server Error: ${response.status}`
          );
        }

        const result = await response.text();


        console.log(
            "Google Apps Script Response:",
            result
        );



        let parsedResult;


        try {

            parsedResult = JSON.parse(result);

        }

        catch(error) {

            parsedResult = {
                status: "success",
                message: result
            };

        }



        // Accept both formats:
        // {"success":true}
        // {"status":"success"}

        const isSuccess =
            parsedResult.success === true ||
            parsedResult.status === "success";



        if (!isSuccess) {

            throw new Error(
                parsedResult.message ||
                "Registration failed"
            );

        }



        return {

            success: true,

            message:
                parsedResult.message ||
                "Registration Successful"

        };



    }

    catch(error) {


        console.error(
            "Registration Error:",
            error
        );


        throw error;


    }

};



// ===============================
// Export API Functions
// ===============================
window.api = {


    submitSoloRegistration: async (data) => {

        return await sendRegistration(
            "Solo",
            data
        );

    },


    submitDuoRegistration: async (data) => {

        return await sendRegistration(
            "Duo",
            data
        );

    },


    submitTeamRegistration: async (data) => {

        return await sendRegistration(
            "Team",
            data
        );

    }


};