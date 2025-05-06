import { supabase } from '@/lib/supabase';
import type { Database } from '../../lib/supabase';

export abstract class BaseService<T extends keyof Database['public']['Tables']> {
  constructor(protected readonly table: T) {}

  protected get tableRef() {
    return supabase.from(this.table);
  }

  async getAll() {
    console.time('[BaseService.getAll]');
    console.log('[BaseService.getAll] Starting...');
    try {
      const { data, error } = await this.tableRef.select('*');
      if (error) {
        console.error('[BaseService.getAll] Error:', error);
        throw error;
      }
      console.log('[BaseService.getAll] Success:', data);
      return data ?? [];
    } catch (error) {
      console.error('[BaseService.getAll] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[BaseService.getAll]');
    }
  }

  async getById(id: string) {
    console.time('[BaseService.getById]');
    console.log('[BaseService.getById] Starting...');
    try {
      const { data, error } = await this.tableRef
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        console.error('[BaseService.getById] Error:', error);
        throw error;
      }
      console.log('[BaseService.getById] Success:', data);
      return data ?? null;
    } catch (error) {
      console.error('[BaseService.getById] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[BaseService.getById]');
    }
  }

  async create(data: Database['public']['Tables'][T]['Insert']) {
    console.time('[BaseService.create]');
    console.log('[BaseService.create] Starting...');
    try {
      const { data: created, error } = await this.tableRef
        .insert(data)
        .select()
        .maybeSingle();
      if (error) {
        console.error('[BaseService.create] Error:', error);
        throw error;
      }
      console.log('[BaseService.create] Success:', created);
      return created ?? null;
    } catch (error) {
      console.error('[BaseService.create] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[BaseService.create]');
    }
  }

  async update(id: string, data: Database['public']['Tables'][T]['Update']) {
    console.time('[BaseService.update]');
    console.log('[BaseService.update] Starting...');
    try {
      const { data: updated, error } = await this.tableRef
        .update(data)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) {
        console.error('[BaseService.update] Error:', error);
        throw error;
      }
      console.log('[BaseService.update] Success:', updated);
      return updated ?? null;
    } catch (error) {
      console.error('[BaseService.update] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[BaseService.update]');
    }
  }

  async delete(id: string) {
    console.time('[BaseService.delete]');
    console.log('[BaseService.delete] Starting...');
    try {
      const { error } = await this.tableRef.delete().eq('id', id);
      if (error) {
        console.error('[BaseService.delete] Error:', error);
        throw error;
      }
      console.log('[BaseService.delete] Success');
    } catch (error) {
      console.error('[BaseService.delete] Error:', error);
      throw error;
    } finally {
      console.timeEnd('[BaseService.delete]');
    }
  }
}