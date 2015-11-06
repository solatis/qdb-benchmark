#pragma once

#include <bench/tests/mongodb/mongodb_facade.hpp>
#include <bench/tests/mongodb/node_status.hpp>
#include <bench/tests/test_template.hpp>
#include <utils/random.hpp>
#include <utils/unique_alias.hpp>

namespace bench
{
namespace tests
{
namespace mongodb
{

template <typename Derived>
class mongodb_test_template : public test_template<Derived>
{
public:
    mongodb_test_template(test_config config) : test_template<Derived>(config), _cluster_uri(config.cluster_uri)
    {
    }

    void setup() override
    {
        _mongodb.connect(_cluster_uri);
    }

    static probe_collection create_probes(test_config cfg)
    {
        probe_collection probes;
        probes.emplace_back(new node_status(cfg.cluster_uri));
        return probes;
    }

protected:
    mongodb_facade _mongodb;

    const std::string & alias(unsigned long iteration) const
    {
        _alias.set_watermark(iteration);
        return _alias;
    }

private:
    std::string _cluster_uri;
    mutable utils::unique_alias _alias;
};

} // namespace mongodb
} // namespace tests
} // namespace bench