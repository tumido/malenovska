# Firebase Storage Bucket Migration

Migrating from legacy `malenovska-305f8.appspot.com` to new `malenovska-305f8` bucket.

## Why

- Legacy `*.appspot.com` buckets use App Engine pricing (flat $0.12/GB egress)
- New buckets use standard GCS tiered pricing (generally cheaper)
- Free download tier: 1 GB/day (legacy) vs 100 GB/month (new)

## Steps

### 1. Create the new bucket

Done via Firebase Console -> Storage -> Add bucket. Created as `gs://malenovska-305f8`.

### 2. Copy files from old bucket to new

```bash
gsutil -m rsync -r gs://malenovska-305f8.appspot.com gs://malenovska-305f8
```

### 3. Deploy storage security rules

```bash
firebase deploy --only storage
```

Verify that `storage.rules` applies to the new bucket (check Firebase Console -> Storage -> Rules tab on the new bucket).

### 4. Dry-run Firestore URL migration

Rewrites all document URLs referencing the old bucket to the new one:

```bash
node scripts/migrate-storage-urls.mjs
```

Review the output — it lists every document that will be updated.

### 5. Apply Firestore URL migration

```bash
node scripts/migrate-storage-urls.mjs --apply
```

### 6. Deploy updated app code

The code changes point `storageBucket` to `malenovska-305f8` in:
- `lib/firebase.ts`
- `scripts/storage-dump.mjs`
- `scripts/storage-seed.mjs`

```bash
npm run deploy:hosting
```

### 7. Verify

- Check the public site — images, galleries, and uploads should work
- Test admin image uploads
- Check browser console for any 404s or storage errors

### 8. Decommission old bucket (optional, after verification)

Once everything is confirmed working, you can delete the old bucket to stop paying for duplicate storage:

```bash
gsutil -m rm -r gs://malenovska-305f8.appspot.com
```

**Warning:** Only do this after confirming all URLs have been migrated and the app works fully on the new bucket.
