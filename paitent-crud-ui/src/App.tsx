import { useEffect, useMemo, useState } from "react";
import type { Gender, Patient, PatientCreate } from "./api/patients.controller";
import { PatientsController } from "./api/patients.controller";
import "./App.css";

const MIN_AGE = 0;
const MAX_AGE = 110;

function normalizeErrors(err: any): string {
  if (!err) return "Unknown error";
  if (typeof err.message === "string") return err.message;

  // DRF field errors: { first_name: ["This field is required."] }
  if (err.data && typeof err.data === "object") {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(err.data)) {
      parts.push(`${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`);
    }
    if (parts.length) return parts.join(" | ");
  }
  return "Request failed";
}

export default function App() {
  const [patient, setPatient] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<number | "new">("new");

  const [form, setForm] = useState<PatientCreate>({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "M",
    age: 18,
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const selectedPatient = useMemo(
    () => patient.find((p) => p.id === selectedId) ?? null,
    [patient, selectedId],
  );

  async function refreshList() {
    const data = await PatientsController.list();
    setPatient(data);
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refreshList();
      } catch (e: any) {
        setError(normalizeErrors(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When selecting an existing person, load into the same form (cohesive UX)
  useEffect(() => {
    if (selectedId === "new") {
      setForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "M",
        age: 18,
      });
      setNotice("");
      setError("");
      return;
    }

    const p = patient.find((x) => x.id === selectedId);
    if (!p) return;

    setForm({
      first_name: p.first_name,
      middle_name: p.middle_name ?? "",
      last_name: p.last_name,
      gender: p.gender,
      age: p.age,
    });
    setNotice("");
    setError("");
  }, [selectedId, patient]);

  function setField<K extends keyof PatientCreate>(
    key: K,
    value: PatientCreate[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!form.first_name.trim()) return "First Name is required.";
    if (!form.last_name?.trim()) return "Last Name is required.";
    if (form.age < MIN_AGE || form.age > MAX_AGE)
      return `Age must be between ${MIN_AGE} and ${MAX_AGE}.`;
    if (form.gender !== "M" && form.gender !== "F")
      return "Gender must be Male or Female.";
    return null;
  }

  async function onSave() {
    setNotice("");
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);
      if (selectedId === "new") {
        const created = await PatientsController.create({
          ...form,
          middle_name: form.middle_name?.trim() ? form.middle_name : null,
        });
        setNotice(`Created #${created.id}`);
      } else {
        const updated = await PatientsController.update(selectedId, {
          ...form,
          middle_name: form.middle_name?.trim() ? form.middle_name : null,
        });
        setNotice(`Updated #${updated.id}`);
      }
      await refreshList();
    } catch (e: any) {
      setError(normalizeErrors(e));
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    setNotice("");
    setError("");

    if (selectedId === "new") {
      setError("Select an existing record to delete.");
      return;
    }

    const ok = confirm(`Delete person ${selectedId}?`);
    if (!ok) return;

    try {
      setLoading(true);
      await PatientsController.remove(selectedId);
      setNotice(`Deleted #${selectedId}`);
      setSelectedId("new");
      await refreshList();
    } catch (e: any) {
      setError(normalizeErrors(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-5">
      <h1 className="text-dark text-center display-4 fw-bold">Patients</h1>
      <hr />
      <div className="row gap-4">
        <div className="col-lg-6 border rounded-4 p-4 shadow">
          <h2>Records</h2>
          <div className="d-lg-flex gap-3 mb-2">
            <button
              className="btn btn-primary w-100"
              disabled={loading}
              onClick={() => setSelectedId("new")}
            >
              + New
            </button>
            <button
              className="btn btn-secondary w-100"
              disabled={loading}
              onClick={refreshList}
            >
              Refresh
            </button>
          </div>
          <div className="row">
            <label>
              Select person
              <select
                className="form-select mt-2"
                style={{ width: "" }}
                value={selectedId}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedId(v === "new" ? "new" : Number(v));
                }}
                disabled={loading}
              >
                <option value="new">New record…</option>
                {patient.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.last_name
                      ? `${p.id}. ${p.last_name}, ${p.first_name}`
                      : `${p.id}. — ${p.first_name}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedPatient && (
            <div className="p-3" style={{ width: "" }}>
              <div>
                <b>ID:</b> {selectedPatient.id}
              </div>
              <div>
                <b>Name:</b> {selectedPatient.last_name},{" "}
                {selectedPatient.first_name} {selectedPatient.middle_name}
              </div>
              <div>
                <b>Gender:</b> {selectedPatient.gender}
              </div>
              <div>
                <b>Age:</b> {selectedPatient.age}
              </div>
              <div>
                <b>Created At:</b> {selectedPatient.created_at}
              </div>
              <div>
                <b>Updated At:</b> {selectedPatient.updated_at}
              </div>
            </div>
          )}
        </div>
        <div className="col border rounded-4 p-4 shadow">
          <div>
            <h2 className="text-dark fw-bold display-6">
              {selectedId === "new"
                ? "Create Patient"
                : `Edit Patient ${selectedId}`}
            </h2>
            <hr />

            {notice && <div>{notice}</div>}
            {error && <div>{error}</div>}

            <div className="row gap-2">
              <label>
                First Name *
                <br />
                <input
                  className="form-control"
                  value={form.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                  disabled={loading}
                />
              </label>

              <label>
                Middle Name
                <br />
                <input
                  className="form-control w-100"
                  value={form.middle_name ?? ""}
                  onChange={(e) => setField("middle_name", e.target.value)}
                  disabled={loading}
                />
              </label>

              <label>
                Last Name *
                <br />
                <input
                  className="form-control w-100"
                  value={form.last_name ?? ""}
                  onChange={(e) => setField("last_name", e.target.value)}
                  disabled={loading}
                />
              </label>
              <label>
                Gender *
                <select
                  className="form-control"
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value as Gender)}
                  disabled={loading}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </label>

              <label>
                Age * (min {MIN_AGE}, max {MAX_AGE})
                <input
                  className="form-control"
                  type="number"
                  value={form.age}
                  min={MIN_AGE}
                  max={MAX_AGE}
                  onChange={(e) => setField("age", Number(e.target.value))}
                  disabled={loading}
                />
              </label>
            </div>
            <br />
            <div className="d-lg-flex gap-2">
              <button
                className="btn btn-primary w-100"
                disabled={loading}
                onClick={onSave}
              >
                {selectedId === "new" ? "Create" : "Save"}
              </button>
              <button
                className="btn btn-danger w-100"
                disabled={loading || selectedId === "new"}
                onClick={onDelete}
              >
                Delete
              </button>
            </div>

            <p className="mt-2 text-muted small mb-0">
              This single form handles Create/Update/Delete. The left panel
              handles Read via selection.
            </p>
          </div>
        </div>
      </div>
      <div>
        {/* Left: select / "read" */}

        {/* Right: cohesive form for create/update/delete */}
      </div>
    </div>
  );
}
