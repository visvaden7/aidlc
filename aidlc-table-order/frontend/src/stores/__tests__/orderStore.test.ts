import { describe, it, expect, beforeEach } from 'vitest';
import { useOrderStore } from '../orderStore';

describe('orderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({ highlightedTableIds: [] });
  });

  it('addHighlight adds a table id', () => {
    useOrderStore.getState().addHighlight(1);
    expect(useOrderStore.getState().highlightedTableIds).toEqual([1]);
  });

  it('addHighlight does not duplicate', () => {
    useOrderStore.getState().addHighlight(1);
    useOrderStore.getState().addHighlight(1);
    expect(useOrderStore.getState().highlightedTableIds).toEqual([1]);
  });

  it('addHighlight supports multiple tables', () => {
    useOrderStore.getState().addHighlight(1);
    useOrderStore.getState().addHighlight(2);
    expect(useOrderStore.getState().highlightedTableIds).toEqual([1, 2]);
  });

  it('removeHighlight removes specific table id', () => {
    useOrderStore.getState().addHighlight(1);
    useOrderStore.getState().addHighlight(2);
    useOrderStore.getState().removeHighlight(1);
    expect(useOrderStore.getState().highlightedTableIds).toEqual([2]);
  });

  it('clearHighlights removes all', () => {
    useOrderStore.getState().addHighlight(1);
    useOrderStore.getState().addHighlight(2);
    useOrderStore.getState().clearHighlights();
    expect(useOrderStore.getState().highlightedTableIds).toEqual([]);
  });
});
