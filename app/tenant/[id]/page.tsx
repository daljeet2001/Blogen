"use client";

import { useSearchParams } from "next/navigation";
import InviteMembers from "../../components/InviteMembers";
import TeamList from "../../components/TeamList";
import RepurposeBlog from "../../components/RepurposeBlog";
import ContentLibrary from "../../components/ContentLibrary";
import { UserPlus, Users, Edit3, X } from "lucide-react";
import { useState, use } from "react";

export default function TenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tenantId } = use(params);
  const searchParams = useSearchParams();
  const tenantName = searchParams.get("name");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showContentLibrary, setShowContentLibrary] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {tenantName ? `${tenantName} Workspace` : "Workspace"}
        </h1>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTeamModal(true)}
            className="flex items-center justify-center text-white text-sm font-medium"
          >
            <Users className="w-4 h-4 mr-1" />
            Team
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center justify-center text-white text-sm font-medium"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Invite
          </button>
          <button
            onClick={() => setShowContentLibrary(true)}
            className="flex items-center justify-center text-black bg-gray-100 hover:bg-gray-200 border px-3 py-1.5 rounded-full text-sm"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Content Library
          </button>
        </div>
      </div>

      {/* Repurpose Blog */}
      <div className="my-8">
        <RepurposeBlog tenantId={tenantId} />
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 text-white rounded-lg p-6 sm:p-8 shadow-lg max-w-md w-full">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Invite Members</h2>
            <InviteMembers tenantId={tenantId} onClose={() => setShowInviteModal(false)} />
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 text-white rounded-lg p-6 sm:p-8 shadow-lg max-w-md w-full">
            <button
              onClick={() => setShowTeamModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Team Members</h2>
            <TeamList tenantId={tenantId} />
          </div>
        </div>
      )}

      {/* Content Library Modal */}
      {showContentLibrary && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 text-white rounded-lg p-6 sm:p-8 shadow-lg max-w-4xl w-full h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowContentLibrary(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Content Library</h2>
            <ContentLibrary tenantId={tenantId} />
          </div>
        </div>
      )}
    </div>
  );
}
