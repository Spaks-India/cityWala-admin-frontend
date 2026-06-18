import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import API from "../../api/axios";
import { handleUpdate } from "../../utils/CrudAction";
import AdminLayout from "./AdminLayout";

const TermsCondition = () => {
    const [title, setTitle] = useState("Terms & Conditions");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const getPlainText = (html) => {
  return html.replace(/<[^>]*>/g, "");
};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get("/admin/terms");

                console.log("🔥 FULL RESPONSE:", res);
                console.log("📦 DATA ONLY:", res.data);

                const data = res.data?.data || res.data;

                console.log("✅ PARSED DATA:", data);

                if (data) {
                    setTitle(data.title || "");
                    setContent(data.content || "");
                }

            } catch (error) {
                console.log("❌ API ERROR:", error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await handleUpdate({
            route: "admin/terms",
            data: { title, content },
            successMessage: "Terms updated successfully",
        });

        setLoading(false);
    };

    return (
        <AdminLayout active="/admin/term-and-condition">
            <div className="container py-4">

                {/* Header */}
                <div className="card shadow-sm mb-4 border-0">
                    <div className="card-body">
                        <h3 className="mb-0">📜 Terms & Conditions Manager</h3>
                        <small className="text-muted">
                            Update website legal content from here
                        </small>
                    </div>
                </div>

                {/* Form */}
                <div className="card shadow-sm border-0">
                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            {/* Title */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title..."
                                />
                            </div>

                            {/* CKEditor */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Content
                                </label>

                                <div className="border rounded p-2">
                                  <CKEditor
    editor={ClassicEditor}
    data={content || ""}
    config={{
        toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "undo",
            "redo",
        ],
        heading: {
            options: [
                { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                { model: "heading1", view: "h1", title: "Heading 1" },
                { model: "heading2", view: "h2", title: "Heading 2" },
                { model: "heading3", view: "h3", title: "Heading 3" },
            ],
        },
    }}
    onChange={(event, editor) => {
        const html = editor.getData();
        setContent(html);
    }}
/>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => console.log({ title, content })}
                                >
                                    Debug Data
                                </button>
                            </div>

                        </form>

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default TermsCondition;