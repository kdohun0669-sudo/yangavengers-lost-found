"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, FormEvent, useState } from "react";
import {
  CATEGORIES,
  ITEM_TYPES,
  STORAGE_LOCATION,
  TIME_NOTES,
  type Category,
  type ItemType,
} from "@/lib/constants";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");

  const [step, setStep] = useState<1 | 2 | 3>(
    initialType === "LOST" || initialType === "FOUND" ? 2 : 1
  );
  const [type, setType] = useState<ItemType | "">(
    initialType === "LOST" || initialType === "FOUND"
      ? (initialType as ItemType)
      : ""
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [eventTimeNote, setEventTimeNote] = useState("");
  const [description, setDescription] = useState("");
  const [contactTime, setContactTime] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files)
      .slice(0, 3 - photos.length)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotos((prev) => [...prev, reader.result as string].slice(0, 3));
        };
        reader.readAsDataURL(file);
      });
    e.target.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          category,
          location,
          eventDate,
          eventTimeNote,
          description,
          contactTime,
          photos,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "등록에 실패했습니다.");
        return;
      }
      router.push(`/items/${data.item.id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <main className="px-4 py-6">
        <h1 className="mb-2 text-xl font-bold">등록</h1>
        <p className="mb-6 text-sm text-slate-600">무엇을 등록할까요?</p>
        <div className="grid grid-cols-2 gap-4">
          {(["LOST", "FOUND"] as ItemType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setStep(2);
              }}
              className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-10 text-center transition hover:border-blue-400"
            >
              <span className="text-4xl">{ITEM_TYPES[t].emoji}</span>
              <p className="mt-3 text-lg font-semibold">
                {t === "LOST" ? "분실했어요" : "주웠어요"}
              </p>
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (step === 2) {
    return (
      <main className="px-4 py-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="mb-4 text-sm text-blue-600"
        >
          ← 유형 선택
        </button>
        <h1 className="mb-1 text-xl font-bold">
          {type && ITEM_TYPES[type].emoji}{" "}
          {type === "LOST" ? "분실 등록" : "습득 등록"}
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
          className="mt-4 space-y-4"
        >
          <Field label="제목" required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='예: "검은색 에어팟 케이스"'
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <Field label="분류" required>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CATEGORIES) as [Category, { label: string }][]).map(
                ([key, val]) => (
                  <label
                    key={key}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm ${
                      category === key
                        ? "border-blue-500 bg-blue-50 font-semibold text-blue-700"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={key}
                      checked={category === key}
                      onChange={() => setCategory(key)}
                      className="sr-only"
                      required
                    />
                    {val.label}
                  </label>
                )
              )}
            </div>
          </Field>

          <Field label="장소" required>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="2층 복도, 매점 앞"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="날짜" required>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </Field>
            <Field label="시간대">
              <select
                value={eventTimeNote}
                onChange={(e) => setEventTimeNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">선택</option>
                {TIME_NOTES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="설명" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="특징, 브랜드, 이름 등"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <Field label="사진 (선택, 최대 3장)">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={photos.length >= 3}
            />
            {photos.length > 0 && (
              <div className="mt-2 flex gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPhotos((p) => p.filter((_, idx) => idx !== i))
                      }
                      className="absolute -right-1 -top-1 rounded-full bg-slate-800 px-1.5 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label="연락 가능 시간 (선택)">
            <input
              value={contactTime}
              onChange={(e) => setContactTime(e.target.value)}
              placeholder="예: 점심시간, 방과 후"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </Field>

          <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
            <p>연락처는 여기 입력하지 않습니다.</p>
            <p className="mt-1">학생회가 가입 시 등록한 카톡으로 연락합니다.</p>
            <p className="mt-1">
              주운 물건은 {STORAGE_LOCATION}에서 수령합니다.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white"
          >
            다음: 확인
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="px-4 py-6">
      <button
        type="button"
        onClick={() => setStep(2)}
        className="mb-4 text-sm text-blue-600"
      >
        ← 수정하기
      </button>
      <h1 className="mb-4 text-xl font-bold">등록 내용 확인</h1>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
        <Row label="유형" value={type ? ITEM_TYPES[type].label : ""} />
        <Row label="제목" value={title} />
        <Row
          label="분류"
          value={category ? CATEGORIES[category].label : ""}
        />
        <Row label="장소" value={location} />
        <Row label="날짜" value={`${eventDate} ${eventTimeNote}`} />
        <Row label="설명" value={description} />
        {photos.length > 0 && <Row label="사진" value={`${photos.length}장`} />}
      </div>

      <p className="mt-4 text-sm text-slate-600">
        학생회가 확인 후 카카오톡으로 연락드립니다.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "등록 중..." : "등록하기"}
      </button>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}</span>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="px-4 py-6">불러오는 중...</main>}>
      <RegisterContent />
    </Suspense>
  );
}
