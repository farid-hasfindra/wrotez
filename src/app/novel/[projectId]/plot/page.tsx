"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import { Network, Plus, BrainCircuit, Maximize } from "lucide-react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Custom Nodes for specific entities ---
function CharacterNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-2xl bg-slate-900 border-2 border-emerald-500 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-emerald-500" />
      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">Character</div>
      <div className="font-black text-white text-sm">{data.label as string}</div>
      {data.role ? <div className="text-[10px] text-slate-400">{String(data.role)}</div> : null}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-emerald-500" />
    </div>
  );
}

function PlotNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-2xl bg-slate-900 border-2 border-purple-500 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-purple-500" />
      <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Plot</div>
      <div className="font-black text-white text-sm">{data.label as string}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-purple-500" />
    </div>
  );
}

function EventNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-2xl bg-slate-900 border-2 border-amber-500 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-amber-500" />
      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">Event</div>
      <div className="font-black text-white text-sm">{data.label as string}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-amber-500" />
    </div>
  );
}

export default function StoryKnowledgeGraphPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({
    character: CharacterNode,
    plot: PlotNode,
    event: EventNode,
  }), []);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/graph`)
      .then((res) => res.json())
      .then((data) => {
        const newNodes: any[] = [];
        const newEdges: any[] = [];

        let yOffset = 50;
        let charX = 50;
        let plotX = 400;
        let eventX = 750;

        // Process Characters
        if (data.characters) {
          data.characters.forEach((char: any, i: number) => {
            newNodes.push({
              id: `char-${char.id}`,
              type: "character",
              position: { x: charX, y: yOffset + (i * 120) },
              data: { label: char.name, role: char.role },
            });

            // Relationships
            if (char.relationshipsFrom) {
              char.relationshipsFrom.forEach((rel: any) => {
                newEdges.push({
                  id: `edge-${rel.id}`,
                  source: `char-${char.id}`,
                  target: `char-${rel.toId}`,
                  label: rel.type,
                  animated: true,
                  style: { stroke: '#10b981', strokeWidth: 2 },
                  labelStyle: { fill: '#10b981', fontWeight: 700, fontSize: 10 },
                  labelBgStyle: { fill: '#0f172a', color: '#fff', padding: 2 },
                });
              });
            }
          });
        }

        // Process Plots & Points
        if (data.plots) {
          data.plots.forEach((plot: any, i: number) => {
            newNodes.push({
              id: `plot-${plot.id}`,
              type: "plot",
              position: { x: plotX, y: yOffset + (i * 180) },
              data: { label: plot.title },
            });

            if (plot.points) {
              plot.points.forEach((pt: any, ptIdx: number) => {
                const ptId = `pt-${pt.id}`;
                newNodes.push({
                  id: ptId,
                  type: "plot",
                  position: { x: plotX + 180, y: yOffset + (i * 180) + (ptIdx * 80) },
                  data: { label: pt.title },
                  style: { transform: 'scale(0.8)' }
                });
                
                newEdges.push({
                  id: `edge-plot-${plot.id}-${pt.id}`,
                  source: `plot-${plot.id}`,
                  target: ptId,
                  animated: true,
                  style: { stroke: '#a855f7', strokeWidth: 1.5 },
                });
              });
            }
          });
        }

        // Process Events
        if (data.events) {
          data.events.forEach((ev: any, i: number) => {
            newNodes.push({
              id: `ev-${ev.id}`,
              type: "event",
              position: { x: eventX, y: yOffset + (i * 100) },
              data: { label: ev.title },
            });
          });
        }

        // If it's completely empty, provide placeholder demo nodes so user sees something wow
        if (newNodes.length === 0) {
          newNodes.push(
            { id: "demo-char-1", type: "character", position: { x: 100, y: 150 }, data: { label: "Elena", role: "Protagonist" } },
            { id: "demo-char-2", type: "character", position: { x: 100, y: 350 }, data: { label: "Marcus", role: "Antagonist" } },
            { id: "demo-plot-1", type: "plot", position: { x: 450, y: 150 }, data: { label: "The Hidden Truth" } },
            { id: "demo-event-1", type: "event", position: { x: 450, y: 350 }, data: { label: "Betrayal at Garrison" } }
          );
          newEdges.push(
            { id: "e1-2", source: "demo-char-1", target: "demo-char-2", label: "Enemy", animated: true, style: { stroke: '#f43f5e' } },
            { id: "e1-3", source: "demo-char-1", target: "demo-plot-1", label: "Involved in", animated: true, style: { stroke: '#8b5cf6' } },
            { id: "e2-4", source: "demo-char-2", target: "demo-event-1", label: "Causes", animated: true, style: { stroke: '#f59e0b' } }
          );
        }

        setNodes(newNodes);
        setEdges(newEdges);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId, setNodes, setEdges]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" /> Story Knowledge Graph
          </div>
          <h1 className="text-3xl font-extrabold text-white">Graf Pengetahuan Cerita</h1>
          <p className="text-xs text-slate-400 mt-1">AI memetakan seluruh koneksi karakter, plot, dan peristiwa dalam novel secara interaktif.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors">
          <Maximize className="w-4 h-4" /> Fullscreen Graph
        </button>
      </div>

      <div className="flex-1 rounded-3xl border border-slate-800 bg-[#0c101d] overflow-hidden shadow-2xl relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            <div className="animate-pulse flex flex-col items-center">
              <Network className="w-12 h-12 mb-4" />
              Memuat Graph Entitas...
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#090d16]"
            minZoom={0.2}
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls className="bg-slate-900 border-slate-800 fill-white text-white rounded-lg overflow-hidden shadow-lg" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.type === 'character') return '#10b981';
                if (n.type === 'plot') return '#a855f7';
                if (n.type === 'event') return '#f59e0b';
                return '#475569';
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mask-minimap"
              maskColor="rgba(15, 23, 42, 0.7)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}