import jwt from 'jsonwebtoken'


function getToken() {
    const API_key = '4c64c9bef6ad9c3b04b0116c4313cfff.ca1pDnEjpNzXQFou';
    const token = generateToken(API_key, 3600);
    return token;
}

// function enableAPI(API_key_json) {
//     // Read JSON
//     const API_key = JSON.parse(fs.readFileSync(API_key_json))["zhipu_api"];
//     return API_key;
// }

function generateToken(apikey, exp_seconds) {
    let id, secret;
    try {
        [id, secret] = apikey.split(".");
        if (id === undefined || secret === undefined) {
            throw new Error("Invalid apikey");
        }
    } catch (error) {
        throw new Error("Invalid apikey", error);
    }

    const payload = {
        "api_key": id,
        "exp": Math.round(Date.now() / 1000) + exp_seconds,
        "timestamp": Math.round(Date.now() / 1000),
    };

    const token = jwt.sign(
        payload,
        secret,
        { algorithm: "HS256", header: { alg: "HS256", sign_type: "SIGN" } }
    );
    return token;
}

export default getToken