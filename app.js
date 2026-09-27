// =====================================================
// CLOUD FILE MANAGER - app.js
// =====================================================

const API_URL =
    "https://hpf42db5ld.execute-api.ap-south-1.amazonaws.com/prod";


// =====================================================
// UPLOAD FILE
// =====================================================

async function uploadFile() {

    const fileInput =
        document.getElementById("fileInput");

    const status =
        document.getElementById("uploadStatus");

    if (!fileInput.files.length) {
        status.innerText =
            "Please select a file.";
        return;
    }

    const file =
        fileInput.files[0];

    status.innerText =
        "Connecting to AWS...";

    try {

        const response =
            await fetch(API_URL + "/upload", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    fileName: file.name
                })
            });

        if (!response.ok) {
            throw new Error(
                "API Gateway error: HTTP " +
                response.status
            );
        }

        const result =
            await response.json();

        console.log(
            "Upload URL response:",
            result
        );

        status.innerText =
            "Uploading file to S3...";

        const uploadResponse =
            await fetch(
                result.uploadUrl,
                {
                    method: "PUT",
                    body: file
                }
            );

        if (!uploadResponse.ok) {
            throw new Error(
                "S3 upload error: HTTP " +
                uploadResponse.status
            );
        }

        status.innerText =
            "✅ File uploaded successfully!";

        fileInput.value = "";

        loadFiles();

    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        status.innerText =
            "❌ Upload failed: " +
            error.message;
    }
}


// =====================================================
// LOAD FILES
// =====================================================

async function loadFiles() {

    const fileList =
        document.getElementById("fileList");

    fileList.innerHTML = `
        <tr>
            <td colspan="4">
                Loading files...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(
                API_URL + "/files"
            );

        if (!response.ok) {
            throw new Error(
                "API error: HTTP " +
                response.status
            );
        }

        let result =
            await response.json();

        console.log(
            "List Files API response:",
            result
        );


        // Handle API Gateway wrapped response
        let files = result;

        if (
            result &&
            typeof result === "object" &&
            result.body
        ) {

            if (
                typeof result.body === "string"
            ) {

                files =
                    JSON.parse(
                        result.body
                    );

            } else {

                files =
                    result.body;
            }
        }


        if (!Array.isArray(files)) {
            throw new Error(
                "Invalid response from API"
            );
        }


        fileList.innerHTML = "";


        if (files.length === 0) {

            fileList.innerHTML = `
                <tr>
                    <td colspan="4">
                        No files found
                    </td>
                </tr>
            `;

            return;
        }


        files.forEach(file => {

            if (!file.fileName) {
                return;
            }

            const row =
                document.createElement("tr");


            let fileSize =
                "Unknown";

            if (
                file.size !== undefined &&
                file.size !== null
            ) {

                fileSize =
                    Number(
                        file.size
                    ).toLocaleString() +
                    " bytes";
            }


            let modifiedDate =
                "Unknown";

            if (file.lastModified) {

                const date =
                    new Date(
                        file.lastModified
                    );

                if (
                    !isNaN(
                        date.getTime()
                    )
                ) {

                    modifiedDate =
                        date.toLocaleString();
                }
            }


            row.innerHTML = `
                <td>
                    ${file.fileName}
                </td>

                <td>
                    ${fileSize}
                </td>

                <td>
                    ${modifiedDate}
                </td>

                <td>

                    <button
                        onclick="downloadFile('${file.s3Key}')">
                        Download
                    </button>

                    <button
                        onclick="shareFile('${file.s3Key}')">
                        Share
                    </button>

                    <button
                        onclick="deleteFile('${file.s3Key}')">
                        Delete
                    </button>

                </td>
            `;

            fileList.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Load files error:",
            error
        );

        fileList.innerHTML = `
            <tr>
                <td colspan="4">
                    ❌ Unable to load files
                </td>
            </tr>
        `;
    }
}


// =====================================================
// DOWNLOAD FILE
// =====================================================

async function downloadFile(s3Key) {

    try {

        const response =
            await fetch(
                API_URL +
                "/download?s3Key=" +
                encodeURIComponent(
                    s3Key
                )
            );

        if (!response.ok) {
            throw new Error(
                "Download API error: HTTP " +
                response.status
            );
        }

        const result =
            await response.json();

        console.log(
            "Download response:",
            result
        );

        window.open(
            result.downloadUrl,
            "_blank"
        );

    } catch (error) {

        console.error(
            "Download error:",
            error
        );

        alert(
            "Download failed: " +
            error.message
        );
    }
}


// =====================================================
// SHARE FILE
// =====================================================

async function shareFile(s3Key) {

    try {

        const response =
            await fetch(
                API_URL +
                "/share?s3Key=" +
                encodeURIComponent(
                    s3Key
                ),
                {
                    method: "POST"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Share API error: HTTP " +
                response.status
            );
        }

        const result =
            await response.json();

        await navigator.clipboard.writeText(
            result.shareUrl
        );

        alert(
            "✅ Share link copied to clipboard!"
        );

    } catch (error) {

        console.error(
            "Share error:",
            error
        );

        alert(
            "Share failed: " +
            error.message
        );
    }
}


// =====================================================
// DELETE FILE
// =====================================================

async function deleteFile(s3Key) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this file?"
        );

    if (!confirmation) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL +
                "/files?s3Key=" +
                encodeURIComponent(
                    s3Key
                ),
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Delete API error: HTTP " +
                response.status
            );
        }

        const result =
            await response.json();

        alert(
            "✅ " +
            result.message
        );

        loadFiles();

    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Delete failed: " +
            error.message
        );
    }
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    alert(
        "Cognito logout will be connected later."
    );
}


// =====================================================
// LOAD FILES WHEN PAGE OPENS
// =====================================================

window.onload = function () {

    loadFiles();

};