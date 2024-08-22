import { Bullseye, Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import axios from 'axios';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NavigateToSystem } from './Utilities/NavigateToSystem';

const Advisories = lazy(() =>
    import(
        /* webpackChunkName: "Advisories" */ './SmartComponents/Advisories/Advisories'
    )
);

const Systems = lazy(() =>
    import(
        /* webpackChunkName: "Systems" */ './SmartComponents/Systems/SystemsPage'
    )
);

const InventoryDetail = lazy(() =>
    import(
        /* webpackChunkName: "InventoryDetail" */ './SmartComponents/SystemDetail/InventoryDetail'
    )
);

const AdvisoryPage = lazy(() =>
    import(
        /* webpackChunkName: "AdvisoryPage" */ './SmartComponents/AdvisoryDetail/AdvisoryDetail'
    )
);

const PackagesPage = lazy(() =>
    import(
        /* webpackChunkName: "Packages" */ './SmartComponents/Packages/Packages'
    )
);

const PackageDetail = lazy(() =>
    import(
        /* webpackChunkName: "PackageDetail" */ './SmartComponents/PackageDetail/PackageDetail'
    )
);

const Templates = lazy(() =>
    import(
        /* webpackChunkName: "Templates" */ './SmartComponents/PatchSet/PatchSet'
    )
);

const TemplateDetail = lazy(() =>
    import(
        /* webpackChunkName: "TemplateDetail" */ './SmartComponents/PatchSetDetail/PatchSetDetail'
    )
);

const PatchRoutes = () => {
    const [hasSystems, setHasSystems] = useState(null);

    const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';
    const RHEL_ONLY_FILTER = '?filter[system_profile][operating_system][RHEL][version][gte]=0';

    useEffect(() => {
        try {
            axios
            .get(`${INVENTORY_TOTAL_FETCH_URL}${RHEL_ONLY_FILTER}&page=1&per_page=1`)
            .then(({ data }) => {
                setHasSystems(data.total > 0);
            });
        } catch (e) {
            console.log(e);
        }
    }, [hasSystems]);

    return !hasSystems ? (
        <Suspense
            fallback={
                <Bullseye>
                    <Spinner />
                </Bullseye>
            }
        >
            <AsyncComponent
                appId="content_management_zero_state"
                appName="dashboard"
                module="./AppZeroState"
                scope="dashboard"
                app="Content_management"
                customFetchResults={hasSystems}
            />
        </Suspense>
    ) : (
        <Routes>
            <Route path="/advisories" element={<Advisories />} />
            <Route
                path="/advisories/:advisoryId/:inventoryId"
                element={<NavigateToSystem />}
            />
            <Route
                path="/advisories/:advisoryId"
                element={<AdvisoryPage />}
            />
            <Route path="/systems" element={<Systems />} />
            <Route
                path="/systems/:inventoryId"
                element={<InventoryDetail />}
            />
            <Route path="/packages" element={<PackagesPage />} />
            <Route
                path="/packages/:packageName"
                element={<PackageDetail />}
            />
            <Route
                path="/packages/:packageName/:inventoryId"
                element={<NavigateToSystem />}
            />
            <Route path="/templates" element={<Templates />} />
            <Route
                path="/templates/:templateName"
                element={<TemplateDetail />}
            />
            <Route path="*" element={<Navigate to="advisories" />} />
        </Routes>
    );
};

export default PatchRoutes;
