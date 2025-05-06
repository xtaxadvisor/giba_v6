import { supabase } from '../../lib/supabase/client';
import type { Database } from '../../lib/supabase/types';

type Tables = Database['public']['Tables'];

export class DatabaseService<T extends keyof Tables> {
  constructor(protected table: T, private defaultSelect = '*') {}

  async getAll() {
    console.time('[DatabaseService.getAll]');
    console.log('[DatabaseService.getAll] Starting...');
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(this.defaultSelect);

      if (error) {
        console.error('[DatabaseService.getAll] Error:', error);
        throw error;
      }
      console.log('[DatabaseService.getAll] Success:', data);
      return data;
    } finally {
      console.timeEnd('[DatabaseService.getAll]');
    }
  }

  async getById(id: string) {
    console.time('[DatabaseService.getById]');
    console.log('[DatabaseService.getById] Starting with id:', id);
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(this.defaultSelect)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('[DatabaseService.getById] Error:', error);
        throw error;
      }
      if (!data) {
        console.warn('[DatabaseService.getById] Warning: No data found for id:', id);
      } else {
        console.log('[DatabaseService.getById] Success:', data);
      }
      return data;
    } finally {
      console.timeEnd('[DatabaseService.getById]');
    }
  }

  async getByField<K extends keyof Tables[T]['Row']>(field: K, value: Tables[T]['Row'][K]) {
    console.time('[DatabaseService.getByField]');
    console.log(`[DatabaseService.getByField] Filtering ${String(field)} =`, value);
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(this.defaultSelect)
        .eq(field as string, value);

      if (error) {
        console.error('[DatabaseService.getByField] Error:', error);
        throw error;
      }
      console.log('[DatabaseService.getByField] Success:', data);
      return data ?? [];
    } finally {
      console.timeEnd('[DatabaseService.getByField]');
    }
  }

  async create(data: Tables[T]['Insert']) {
    console.time('[DatabaseService.create]');
    console.log('[DatabaseService.create] Starting with data:', data);
    try {
      const { data: created, error } = await supabase
        .from(this.table)
        .insert(data)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[DatabaseService.create] Error:', error);
        throw error;
      }
      console.log('[DatabaseService.create] Success:', created);
      return created;
    } finally {
      console.timeEnd('[DatabaseService.create]');
    }
  }

  async update(id: string, data: Tables[T]['Update']) {
    console.time('[DatabaseService.update]');
    console.log('[DatabaseService.update] Starting with id:', id, 'and data:', data);
    try {
      const { data: updated, error } = await supabase
        .from(this.table)
        .update(data)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[DatabaseService.update] Error:', error);
        throw error;
      }
      if (!updated) {
        console.warn('[DatabaseService.update] Warning: No record updated for id:', id);
      } else {
        console.log('[DatabaseService.update] Success:', updated);
      }
      return updated;
    } finally {
      console.timeEnd('[DatabaseService.update]');
    }
  }

  async delete(id: string) {
    console.time('[DatabaseService.delete]');
    console.log('[DatabaseService.delete] Starting with id:', id);
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[DatabaseService.delete] Error:', error);
        throw error;
      }
      console.log('[DatabaseService.delete] Success: Record deleted with id:', id);
    } finally {
      console.timeEnd('[DatabaseService.delete]');
    }
  }
}