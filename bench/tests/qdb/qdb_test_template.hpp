#pragma once

#include <bench/tests/test_template.hpp>
#include <bench/tests/qdb/node_status.hpp>
#include <utils/qdb_wrapper.hpp>
#include <utils/random.hpp>

#include <chrono>
#include <iostream>
#include <vector>
#include <sstream>
#include <thread>

namespace bench
{
namespace tests
{
namespace qdb
{
template <typename Derived>
class qdb_test_template : public test_template<Derived>
{
public:
    qdb_test_template(test_config config)
        : test_template<Derived>(config), _thread_id(std::this_thread::get_id())
    {
        _alias = create_unique_alias();
        _qdb.connect(config.cluster_uri);        
    }

    static probe_collection create_probes(test_config cfg)
    {
        probe_collection probes;
        probes.emplace_back(new node_status(cfg.cluster_uri));
        return probes;
    }

protected:
    std::string _alias;
    utils::qdb_wrapper _qdb;

private:
    std::string create_unique_alias()
    {
        static int alias_counter;
        std::ostringstream s;

        s << "benchmarks-"
          << std::chrono::duration_cast<std::chrono::seconds>(
                 std::chrono::steady_clock::now().time_since_epoch()).count() << "-" << _thread_id
          << "-" << alias_counter;

        alias_counter++;

        return s.str();
    }

    std::thread::id _thread_id;
};
}
}
}