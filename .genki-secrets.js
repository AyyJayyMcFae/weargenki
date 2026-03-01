// Local-only runtime config. Keep this file out of version control.
// It now overrides only keys with non-placeholder local values.
(function () {
  const existing = window.__GENKI_CONFIG__ || {};
  const local = {
    SUPABASE_URL: 'REPLACE_WITH_SUPABASE_URL',
    SUPABASE_ANON_KEY: 'REPLACE_WITH_SUPABASE_ANON_KEY',
    SQUARE_APP_ID: 'REPLACE_WITH_SQUARE_APP_ID',
    SQUARE_LOCATION_ID: 'REPLACE_WITH_SQUARE_LOCATION_ID'
  };

  const isPlaceholder = (value) => {
    const v = String(value || '').trim();
    return !v || v.startsWith('REPLACE_WITH_');
  };

  const merged = { ...existing };
  Object.entries(local).forEach(([key, value]) => {
    if (!isPlaceholder(value)) {
      merged[key] = value;
    } else if (!(key in merged)) {
      merged[key] = value;
    }
  });

  window.__GENKI_CONFIG__ = merged;
})();
